import { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import { randomDigits } from "crypto-secure-random-digit"

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  let secretLoginCode: string

  if (!event.request.session || !event.request.session.length) {
    // This is a new session, generate a new code
    secretLoginCode = randomDigits(6).join('')
    console.log(`Confirmation code: ${secretLoginCode}`)
  } else {
    // There's an existing session, reuse the previously-generated code
    const previousChallenge = event.request.session.slice(-1)[0]
    secretLoginCode = previousChallenge.challengeMetadata!.match(/CODE-(\d*)/)![1]
  }

  // This is sent back to the client app
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email
  }

  // Store the secret code in the private parameters, where it can be accessed by
  // the verifyAuthChallenge.ts lambda
  event.response.privateChallengeParameters = { secretLoginCode }

  // Add the secret login code to the session so it is available to a future
  // invocation of this lambda
  event.response.challengeMetadata = `CODE-${secretLoginCode}`

  return event
}
