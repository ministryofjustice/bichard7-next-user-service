type Props = {
  userManagerNames: string[]
}

const UserManagers = ({ userManagerNames }: Props) => (
  <p className="govuk-body">
    {`If you have any queries about your permissions or cannot see the resources you expect, please contact one of the user managers for your force.`}
    <details className="govuk-details" data-module="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">{"Who are the user managers in my force?"}</span>
      </summary>
      <ul data-test="manager-list">
        {userManagerNames.map((um) => (
          <li key={um}>{um}</li>
        ))}
      </ul>
    </details>
  </p>
)

export default UserManagers
