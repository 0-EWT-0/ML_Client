import type { Profile } from "@/types/profile";
import {GenericRequest} from "./GenericRequest";
import type { ResponseHelper } from "@/types/ResponseHelper";

const urlBase = "data";

export async function getProfile(username: string): Promise<ResponseHelper<Profile> | null> {
  return await GenericRequest<Profile>({
    url: `${urlBase}/${username}`,
    method: 'GET',
  });
}
export async function postProfile(profile: Profile){
  return await GenericRequest<Profile>
  ({
    url: `${urlBase}`,
    method: "POST",
    data: {
      Age: profile.Age,
      Gender: profile.Gender,
      Academic_Level: profile.Academic_Level,
      Country: profile.Country,
      Avg_Daily_Usage_Hours: profile.Avg_Daily_Usage_Hours,
      Most_Used_Platform: profile.Most_Used_Platform,
      Sleep_Hours_Per_Night: profile.Sleep_Hours_Per_Night,
      Relationship_Status: profile.Relationship_Status,
      Conflicts_Over_Social_Media: profile.Conflicts_Over_Social_Media,
    },
  });
}
