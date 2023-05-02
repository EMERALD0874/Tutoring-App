export interface ProfilePicture {
    id: UUID;
    user_id: UUID;
    profile_picture: Buffer;
    file_type: string;
}
