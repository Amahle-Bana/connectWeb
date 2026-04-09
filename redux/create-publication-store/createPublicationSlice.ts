import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CreatePublicationState {
  publicationId: number | string | null;
  selectedPublicationName: string;
  selectedPublicationDomain: string;
}

const initialState: CreatePublicationState = {
  publicationId: null,
  selectedPublicationName: "",
  selectedPublicationDomain: "",
};

const createPublicationSlice = createSlice({
  name: "createPublication",
  initialState,
  reducers: {
    createPublication: (
      state,
      action: PayloadAction<{
        field: keyof CreatePublicationState;
        value: CreatePublicationState[keyof CreatePublicationState];
      }>
    ) => {
      const { field, value } = action.payload;
      switch (field) {
        case "publicationId":
          state.publicationId = value as CreatePublicationState["publicationId"];
          break;
        case "selectedPublicationName":
          state.selectedPublicationName = String(value ?? "");
          break;
        case "selectedPublicationDomain":
          state.selectedPublicationDomain = String(value ?? "");
          break;
      }
    },
    resetCreatePublication: () => initialState,
  },
});

export const { createPublication, resetCreatePublication } =
  createPublicationSlice.actions;
export default createPublicationSlice.reducer;
