import { Switch } from "@headlessui/react"
import React from "react"

export const CheckboxInput = ({
  value = false,
  onChange = () => {},
  label = "",
}: {
  value?: boolean;
  onChange?: (v: boolean) => any;
  label?: string | { active: string, inactive: string }
}) => {
  const strLabel = typeof label === "string"
  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch
          checked={value}
          onChange={onChange}
          className={`${
            value ? 'bg-indigo-600' : 'bg-gray-200'
          } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          <span
            className={`${
              value ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
          />
        </Switch>
        <Switch.Label className="ml-4">{
          strLabel ? label : (value ? label.active : label.inactive)
        }</Switch.Label>
      </div>
    </Switch.Group>
  )
}