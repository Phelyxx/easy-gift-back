/**
 * Representa los errores de negocio que pueden generarse en la aplicacion
 * @param message El mensaje del error de negocio
 * @param type El tipo del error de negocio
 */

export function BusinessLogicException(message: string, type: number) {
  this.message = message;
  this.type = type;
}

/**
 * Enumeracion que define los tipos de errores de negocio, a saber: no encontrado, precondicion fallida y 
 * mala peticion
 */
export enum BusinessError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST
}
