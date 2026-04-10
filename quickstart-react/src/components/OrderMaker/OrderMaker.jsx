import React, { useState, useEffect } from "react";
import { TextField, Dropdown, Button, Divider, Icon, Toast } from "@vibe/core";
import { Filter } from "@vibe/icons";
import mondaySdk from "monday-sdk-js";

import "./OrderMaker.css";

const monday = mondaySdk();

export default function OrderMaker() {
  const [addingOrder, setAddingOrder] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [quantity, setQuantity] = useState(undefined);
  const [selectedFragrances, setSelectedFragrances] = useState([]);
  const [fragranceOptions, setFragranceOptions] = useState([]);
  const [fragranceDropdownTouched, setFragranceDropdownTouched] =
    useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const showSuccessToast = () => {
    setToastOpen(true);
    setTimeout(() => {
      setToastOpen(false);
    }, 3000);
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setQuantity(undefined);
    setSelectedFragrances([]);
    setFragranceDropdownTouched(false);
  };

  const onFragrancesChange = (values) => {
    if (!fragranceDropdownTouched) {
      setFragranceDropdownTouched(true);
    }
    setSelectedFragrances(values);
  };

  const getBoardColumns = async () => {
    const query = `
    query {
      boards(ids: 18408011119) {
        id
        name
        columns {
          id
          title
          type
        }
      }
    }
  `;

    const response = await monday.api(query);
    console.log("BOARD COLUMNS:", response);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setAddingOrder(true);
    const itemName = `Order - ${firstName} ${lastName}`.trim();
    const boardId = 18408011119;
    const query = `
    mutation ($boardId: ID!, $itemName: String!) {
      create_item(
        board_id: $boardId,
        item_name: $itemName
      ) {
        id
      }
    }
  `;

    const response = await monday.api(query, {
      variables: {
        boardId,
        itemName,
      },
    });

    if (response.data.create_item) {
      setAddingOrder(false);
      resetForm();
      showSuccessToast();
    }
  };

  useEffect(() => {
    monday.listen("context", (res) => {
      // console.log("FULL CONTEXT RESPONSE:", res);
      getBoardColumns();
    });
  }, []);

  useEffect(() => {
    const fetchFragrances = async () => {
      try {
        const response = await fetch("api/fragrances");
        const data = await response.json();
        const fragranceOptions = data.map((fragrance) => ({
          value: fragrance.id,
          label: fragrance.name,
        }));
        setFragranceOptions(fragranceOptions);
      } catch (error) {
        console.error("Error fetching fragrances:", error);
      }
    };
    fetchFragrances();
  }, []);

  const hasInvalidFragranceCount =
    selectedFragrances && selectedFragrances.length !== 3;
  const isFormValid =
    firstName && lastName && quantity > 0 && !hasInvalidFragranceCount;

  return (
    <div className="order-maker">
      <Toast
        open={toastOpen}
        type="positive"
        className="order-maker__toast--success"
      >
        Order started!
      </Toast>
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
                placeholder="0"
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
                value={selectedFragrances}
              />
            </div>
          </div>

          <div className="order-maker__actions">
            <Button
              size="medium"
              onClick={handleSubmit}
              disabled={!isFormValid}
              loading={addingOrder}
            >
              Start Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
