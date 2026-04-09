import React, { useState } from "react";
import { TextField, Dropdown, Button, Divider, Icon } from "@vibe/core";
import { Filter } from "@vibe/icons";
import "./OrderMaker.css";

const fragranceOptions = [
  { value: "herbaceous", label: "Herbaceous" },
  { value: "fruity", label: "Fruity" },
  { value: "fresh", label: "Fresh" },
  { value: "woody", label: "Woody" },
  { value: "floral", label: "Floral" },
];

export default function OrderMaker() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [quantity, setQuantity] = useState(undefined);
  const [fragrances, setFragrances] = useState([]);
  const [fragranceDropdownTouched, setFragranceDropdownTouched] =
    useState(false);

  const onFragrancesChange = (values) => {
    if (!fragranceDropdownTouched) {
      setFragranceDropdownTouched(true);
    }
    setFragrances(values);
  };

  const hasInvalidFragranceCount = fragrances && fragrances.length !== 3;
  return (
    <div className="order-maker">
      <div className="order-maker__card">
        <div className="order-maker__title-container">
          <h2 className="order-maker__title">
            Order Maker
            <Icon className="order-maker_title-icon" icon={Filter} />
          </h2>
        </div>
        <Divider />
        <div className="order-maker__form">
          <div className="order-maker__row">
            <div className="order-maker__field order-maker__field--name">
              <TextField
                required={true}
                requiredErrorText="Required"
                id="first-name"
                title="First Name*"
                placeholder="John"
                size="medium"
                onChange={setFirstName}
                value={firstName}
              />
            </div>

            <div className="order-maker__field order-maker__field--name">
              <TextField
                required={true}
                requiredErrorText="Required"
                id="last-name"
                title="Last Name*"
                placeholder="Smith"
                size="medium"
                onChange={setLastName}
                value={lastName}
              />
            </div>

            <div className="order-maker__field">
              <TextField
                required={true}
                requiredErrorText="Required"
                id="quantity"
                title="Quantity*"
                placeholder="1"
                size="medium"
                onChange={setQuantity}
                value={quantity}
              />
            </div>
          </div>

          <div className="order-maker__row">
            <div className="order-maker__field order-maker__field--full">
              <Dropdown
                className={`order-maker__dropdown${fragranceDropdownTouched && hasInvalidFragranceCount ? "--error" : ""}`}
                placeholder="Select 3 fragrances"
                multi
                options={fragranceOptions}
                onChange={onFragrancesChange}
                value={fragrances}
                error={"ERROR"}
              />
            </div>
          </div>

          <div className="order-maker__actions">
            <Button size="medium">Start Order</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
