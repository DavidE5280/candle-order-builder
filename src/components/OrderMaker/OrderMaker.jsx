import React, { useState, useEffect } from "react";
import { TextField, Dropdown, Button, Divider, Icon, Toast } from "@vibe/core";
import { Filter } from "@vibe/icons";
import mondaySdk from "monday-sdk-js";
import { fetchFragrances } from "../../api/fragrances";
import { createOrder } from "../../api/monday";
import "./OrderMaker.css";

const monday = mondaySdk();

export default function OrderMaker() {
  const [boardId, setBoardId] = useState(undefined);
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

  const handleSubmit = async () => {
    if (!isFormValid || !boardId) return;
    setAddingOrder(true);
    const itemName = `Order - ${firstName} ${lastName}`.trim();

    try {
      const response = await createOrder(boardId, itemName);
      if (response.id) {
        resetForm();
        showSuccessToast();
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setAddingOrder(false);
    }
  };

  useEffect(() => {
    monday.listen("context", (res) => {
      setBoardId(res.data.boardId);
    });
  }, []);

  useEffect(() => {
    const getFragrances = async () => {
      try {
        const fragrances = await fetchFragrances();
        const fragranceOptions = fragrances.map((fragrance) => ({
          value: fragrance.id,
          label: fragrance.name,
        }));
        setFragranceOptions(fragranceOptions);
      } catch (error) {
        console.error("Error fetching fragrances:", error);
      }
    };
    getFragrances();
  }, []);

  const hasInvalidFragranceCount = selectedFragrances.length !== 3;
  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    quantity > 0 &&
    !hasInvalidFragranceCount;

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
        <h2 className="order-maker__title">
          Order Maker
          <Icon className="order-maker__title-icon" icon={Filter} />
        </h2>
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
                onChange={(quantity) => setQuantity(Number(quantity))}
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
