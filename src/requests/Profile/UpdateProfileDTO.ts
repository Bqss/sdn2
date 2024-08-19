import { IsNotEmpty } from "class-validator";

export class UpdateProfileDTO {
  @IsNotEmpty()
  profile_singkat : string;

  @IsNotEmpty()
  profile_lengkap : string;

  @IsNotEmpty()
  visi : string;

  @IsNotEmpty()
  misi: string;

  @IsNotEmpty()
  sejarah: string;

}