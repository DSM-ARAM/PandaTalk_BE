import { peopleIs } from "../entity/people.entity";

export class peopleDto {
    peopleIs: peopleIs;
    peopleSchoolNumber?: number;
    peopleDepartment?: string;
    peoplePhoneNumber: string;
    peopleName: string;
    peopleGroupID?: number;
}