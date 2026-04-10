import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

export const createOrder = async (boardId, itemName) => {
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
    variables: { boardId, itemName },
  });

  return response.data.create_item;
};
