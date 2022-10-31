import type { Id } from '$lib/Pantry';

export type AddEditorRequest = {
  editorsToAdd: { email: string }[];
};
