import jwt from "jsonwebtoken"
import { Result } from "types/Result"
import UserFullDetails from "types/UserFullDetails"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import config from "../config"
import UserGroup from "../../types/UserGroup"

const signOptions: jwt.SignOptions = {
  issuer: config.tokenIssuer
}

export type AuthenticationToken = string

export interface AuthenticationTokenPayload {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  emailAddress: string
  groups: UserGroup[]
  id: string
}

export function generateAuthenticationToken(user: Partial<UserFullDetails>, uniqueId: string): AuthenticationToken {
  const options: jwt.SignOptions = {
    expiresIn: config.tokenExpiresIn,
    ...signOptions
  }

  const payload: AuthenticationTokenPayload = {
    username: user.username as string,
    exclusionList: user.exclusionList as string[],
    inclusionList: user.inclusionList as string[],
    emailAddress: user.emailAddress as string,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    groups: user.groups as UserGroup[],
    id: uniqueId
  }

  return jwt.sign(payload, config.tokenSecret, options)
}

export function decodeAuthenticationToken(token: string): Result<AuthenticationTokenPayload> {
  try {
    return jwt.verify(token, config.tokenSecret, signOptions) as AuthenticationTokenPayload
  } catch (error) {
    return error as Error
  }
}

export async function isTokenIdValid(connection: Database, uniqueId: string): PromiseResult<boolean> {
  /* eslint-disable no-useless-escape */
  const query = `
    SELECT COUNT(1)
    FROM br7own.jwt_ids
    WHERE id = $\{uniqueId\};
  `
  /* eslint-disable no-useless-escape */

  try {
    const count = await connection.one(query, { uniqueId })
    return !!count
  } catch (error) {
    return error as Error
  }
}

export async function removeTokenId(connection: Database, uniqueId: string): PromiseResult<void> {
  /* eslint-disable no-useless-escape */
  const removeTokenIdQuery = `
    DELETE FROM br7own.jwt_ids
    WHERE id = $\{uniqueId\};
  `
  /* eslint-disable no-useless-escape */

  try {
    await connection.none(removeTokenIdQuery, { uniqueId })
    return undefined
  } catch (error) {
    return error as Error
  }
}

export async function storeTokenId(connection: Database, userId: number, uniqueId: string): PromiseResult<void> {
  /* eslint-disable no-useless-escape */
  const storeTokenIdQuery = `
    INSERT INTO br7own.jwt_ids
    (
      id,
      generated_at,
      user_id
    )
    VALUES
    (
      $\{id\},
      NOW(),
      $\{user_id\}
    );
  `
  /* eslint-disable no-useless-escape */

  try {
    await connection.none(storeTokenIdQuery, { id: uniqueId, user_id: userId })
    return undefined
  } catch (error) {
    return error as Error
  }
}
