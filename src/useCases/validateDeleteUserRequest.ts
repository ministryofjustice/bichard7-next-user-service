import { IncomingMessage } from "http"
import parseFormData from "lib/parseFormData"
import { User } from "lib/User"

export default async (user: User, request: IncomingMessage): Promise<boolean> => {
  const { deleteAccountConfirmation } = (await parseFormData(request)) as { deleteAccountConfirmation: string }

  if (user.username !== deleteAccountConfirmation) {
    return false
  }

  return true
}
