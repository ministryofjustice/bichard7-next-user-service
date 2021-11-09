import React from "react"
import { UserGroupResult } from "types/UserGroup"
import { Fieldset } from "./Fieldset"

interface Props {
    allOptions: any[] | undefined
    selectedOptions: any[] | undefined
    controlLabel?: string
    label: string
}

const CheckboxMultiSelect = ({ allOptions, selectedOptions, controlLabel, label }: Props) => {
    return (
        <Fieldset>
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                <h5 className="govuk-fieldset__heading">{controlLabel}</h5>
            </legend>
            <div id="waste-hint" className="govuk-hint">
                {label}
            </div>
            <div className="govuk-checkboxes" data-module="govuk-checkboxes">
                {allOptions?.map((group: UserGroupResult) => (
                    <div key={group.id} className="govuk-checkboxes__item">
                        <input
                            className="govuk-checkboxes__input"
                            id={group.id}
                            name={group.name}
                            type="checkbox"
                            value={selectedOptions && selectedOptions.length ? "yes" : "no"}
                            defaultChecked={selectedOptions?.find((selectedOption) => selectedOption.id === group.id) !== undefined}
                        />

                        <label className="govuk-label govuk-checkboxes__label" htmlFor={group.id}>
                            {group.name}
                        </label>
                    </div>
                ))}
            </div>
        </Fieldset>
    )
}

export default CheckboxMultiSelect
