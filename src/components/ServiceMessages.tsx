import { format } from "date-fns"
import ServiceMessage from "types/ServiceMessage"
import Paragraph from "./Paragraph"

interface Props {
  messages: ServiceMessage[]
}

const ServiceMessages = ({ messages }: Props) => (
  <>
    {messages.length === 0 && <Paragraph>{"There are no service messages to display."}</Paragraph>}

    {messages.map((message, index) => (
      <div className="govuk-grid-row" key={String(index)}>
        <div className="govuk-grid-column-full">
          <Paragraph className="govuk-!-font-size-16">
            <time
              className="govuk-!-font-weight-bold govuk-!-font-size-14"
              aria-label="time"
              title={format(new Date(message.createdAt), "dd MMMM yyyy HH:mm")}
            >
              {format(new Date(message.createdAt), "dd MMMM yyyy")}
            </time>
            <br />
            {message.message}
          </Paragraph>
        </div>
      </div>
    ))}
  </>
)

export default ServiceMessages
