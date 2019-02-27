/**
 * Created by ofertonani on 10/01/2017.
 */
export interface Page<T> {

  content:T[],
  totalPages: number,
  totalElements: number,
  last: boolean,
  size: number,
  number: number,
  sort: Sort[],
  numberOfElements: number,
  first: boolean

}

export interface Sort{
  direction: string,
  property: string,
  ignoreCase:boolean,
  nullHandling:string,
  ascending:boolean
}
