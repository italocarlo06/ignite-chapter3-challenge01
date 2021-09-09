import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
    .createQueryBuilder("games")    
    .where("title ilike :title",{ title : `%${param}%`})
    .getMany();
    return games;
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const count = await this.repository.query("Select count(*) from games");
    return count;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game  = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("games.users", "user")
      .where(" games.id = :id ", { id }).getOneOrFail();
    const { users } = game;
    return users;      
  }
}
