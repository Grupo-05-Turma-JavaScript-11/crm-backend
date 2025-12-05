import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoModule } from './medico/medico.module';
import { Medico } from './medico/entities/medico.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'db_abgail',
      entities: [Medico],
      synchronize: true,
    }), 
    MedicoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
