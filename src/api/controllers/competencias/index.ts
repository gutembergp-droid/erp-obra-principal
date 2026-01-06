/**
 * Barrel export para controllers de Competências
 * 
 * Agrega todas as operações seguindo o padrão proposto
 */
import * as create from './Create';
import * as read from './Read';
import * as update from './Update';

export const CompetenciasControl = {
  ...create,
  ...read,
  ...update,
};

