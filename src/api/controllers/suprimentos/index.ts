/**
 * Barrel export para controllers de Suprimentos
 * 
 * Agrega todas as operações CRUD seguindo o padrão proposto
 */
import * as create from './Create';
import * as read from './Read';
import * as update from './Update';
import * as deletar from './Delete';

export const SuprimentosControl = {
  ...create,
  ...read,
  ...update,
  ...deletar,
};

