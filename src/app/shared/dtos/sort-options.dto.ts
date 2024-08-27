import { SortDirectionEnum } from '../enums/sort-direction.enum';

export class SortOptionsDto {
  sortBy = '_id';
  direction: SortDirectionEnum = SortDirectionEnum.DESC;
}
