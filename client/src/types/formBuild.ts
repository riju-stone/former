import { FormElement } from "./formState";

export type FormBuild = {
	id: string;
	formName: string;
	builderData: Array<FormElement>;
	createdAt: Date;
	updatedAt: Date;
};
