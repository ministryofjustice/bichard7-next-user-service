type Props = {
  userManagerNames: string
}

const UserManagers = ({ userManagerNames }: Props) => (
  <p className="govuk-body">
    {`If you have any queries about your permissions or cannot see the resources you expect, please contact one of the user managers for your force: ${userManagerNames}.`}
  </p>
)

export default UserManagers
