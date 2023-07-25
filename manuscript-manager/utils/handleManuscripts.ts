import { ManuscriptType } from "@/types/manuscripts";

interface UserInfo {
  user: string | undefined;
  payRate: number | undefined;
}

export async function handleManuscripts(
  action: string,
  reset: () => void,
  get: () => void,
  date: Date,
  manuscriptID: string,
  wordCount: number | undefined,
  latex: boolean,
  double: boolean,
  triple: boolean,
  bonus: number,
  turnAround: string,
  authorBio: number,
  userInfo: UserInfo,
  m?: ManuscriptType
) {
  // add manuscript to db
  // capture date manuscript was submitted (previously Mongoose did this for us)

  const createdAt = action === "POST" ? new Date().toISOString() : m?.createdAt;
  const updatedAt = new Date().toISOString();
  const apiPath =
    action === "POST"
      ? "/api/manuscripts/postManuscript"
      : `/api/manuscripts/updateManuscript?id=${m?._id}`;

  const { user, payRate } = userInfo;

  const manuscript = {
    date,
    manuscriptID,
    wordCount,
    latex,
    double,
    triple,
    bonus,
    turnAround,
    authorBio,
    createdAt,
    updatedAt,
    user,
    payRate,
  };

  try {
    const requestOptions = {
      method: action,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(manuscript),
    };
    let response;
    if (action === "PATCH" && m) {
      response = await fetch(apiPath, requestOptions);
    } else {
      response = await fetch(apiPath, requestOptions);
    }

    const json = await response.json();

    if (!response.ok) {
      //handle specific response codes here
      if(response.status === 409) {
        return "Manuscript already exists"
      }
      action === "POST"
        ? console.log("There was an error submitting the manuscript.")
        : console.log("There was an error updating the manuscript.");
      return "error"
    }

    if (response.ok) {
      // TODO: reset state values and input fields
      console.log("Response ok:", json);
      reset();
      get();
      return "success";
    }
  } catch (error) {
    console.error("Error:", error);
    return error
  }
  // update state by fetching new manuscripts for today
}
