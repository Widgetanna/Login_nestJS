import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/user.entity';
import { AuthService } from '../../auth/services/auth.service';
import { IUser } from 'user/model/user.interface';
interface IUserFindOneOptions extends FindOneOptions<UserEntity> {}

@Injectable()
export class UserService {
  constructor(
    //décorateur fourni par TypeORM (Object-Relational Mapping)
    //utilisé pour injecter un référentiel de données (UserEntity) dans la classe.
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  public async create(user: IUser): Promise<IUser> {
    try {
      const passwordHash: string = await this.authService.hashPassword(
        user.password,
      );

      const newUser = new UserEntity();
      newUser.password = passwordHash;
      newUser.email = user.email.toLowerCase().trim();
      newUser.name = user.name.toLowerCase().trim();
      newUser.username = user.username.toLowerCase().trim();

      const savedUser = await this.userRepository.save(newUser);

      // Ne pas afficher le mot de passe
      const result: IUser = {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        username: savedUser.username,
        // ... autres propriétés que vous pourriez avoir
      };

      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
  //return await this.userRepository.save(user);
  public async findOne(id: number): Promise<IUser | undefined> {
    const options: IUserFindOneOptions = {
      where: { id },
    };
    return await this.userRepository.findOne(options);
  }

  //return await this.userRepository.findOne({ where: { id } });

  async findAll(): Promise<IUser[]> {
    const users = await this.userRepository.find();
    return users;
  }

  //return await this.userRepository.find();

  async deleteOne(id: number): Promise<any> {
    return await this.userRepository.delete(id);
  }

  async updateOne(id: number, user: IUser): Promise<HttpStatus> {
    delete user.email;
    delete user.password;
    const userTest = await this.userRepository.findOne({ where: { id: id } });
    console.log(userTest);
    if (!id) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.update(userTest.id, user);
    return HttpStatus.OK;
  }
  async login(user: IUser): Promise<string> {
    const validatedUser = await this.valideUser(user.email, user.password);
    console.log(validatedUser);
    if (validatedUser) {
      const jwt = await this.authService.generateJWT(validatedUser);
      console.log(jwt);
      return jwt;
    } else {
      return 'Wrong Credential';
    }
  }
  async findByMail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }
  public async valideUser(
    email: string,
    enteredPassword: string,
  ): Promise<IUser> {
    try {
      const user = await this.findByMail(email);
      console.log('utilisateur', user);
      // Vérifiez si l'utilisateur a été trouvé
      if (!user) {
        throw new Error('User not found');
      }
      console.log('Stored Password:', user.password);
      // Vérifiez que le mot de passe de l'utilisateur est défini
      if (user.password) {
        console.log('Entered Password:', enteredPassword);
        const match = await this.authService.comparePassword(
          enteredPassword,
          user.password,
        );
        if (match) {
          return user;
        } else {
          throw new Error('Invalid password');
        }
      } else {
        throw new Error('User password not found');
      }
    } catch (error) {
      console.error('Error in validating user:', error);
      throw new Error('Invalid password');
    }
  }
}
