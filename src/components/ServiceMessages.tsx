import { format } from "date-fns"
import ServiceMessage from "types/ServiceMessage"

interface Props {
  messages: ServiceMessage[]
}

const ServiceMessages = ({ messages }: Props) => (
  <>
    {messages.length === 0 && <p className="govuk-body">{"There are no service messages to display."}</p>}

    {messages.map((message, index) => (
      <div className="govuk-grid-row" key={String(index)}>
        <div className="govuk-grid-column-full">
          <p className="govuk-body govuk-!-font-size-16">
            <time
              className="govuk-!-font-weight-bold govuk-!-font-size-14"
              aria-label="time"
              title={format(new Date(message.createdAt), "dd MMMM yyyy HH:mm")}
            >
              {format(new Date(message.createdAt), "dd MMMM yyyy")}
            </time>
            <br />
            {message.message}
          </p>
        </div>
      </div>
    ))}
  </>
)

export default ServiceMessages
