/**
 * Barrel export para controllers de Obras
 * 
 * Agrega todas as operações CRUD seguindo o padrão proposto
 */
import * as create from './Create';
import * as read from './Read';
import * as update from './Update';
import * as deletar from './Delete';

export const ObrasControl = {
  ...create,
  ...read,
  ...update,
  ...deletar,
};

