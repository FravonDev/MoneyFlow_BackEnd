import { Request } from "express";

const schemaUser: any = {
  name: {
    required: "name required",
    min: 2,
    max: 255,
  },
  password: {
    required: "password required",
    min: 8,
    max: 32,
  },
  email: {
    required: "E-mail required",
  },
};

const validationRegex: any = {
  email: {
    regex: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
  },
  name: {
    regex: "^[A-zÀ-ú '´]+$",
  },
};

function validateUser(request: Request) {
  const { body } = request;
  const errors: string[] = [];
  Object.keys(schemaUser).forEach((item) => {
    const itemSchema = schemaUser[item];

    if (itemSchema.required && !body[item]) {
      errors.push(`${item} - ${itemSchema.required}`);
    }
    if (body[item] != body[item].replace(/\s+/g, " ").trim()) {
      errors.push(`${item} - has invalid spaces`);
    }
    if (itemSchema.min && body[item].length < itemSchema.min) {
      errors.push(`${item} - minimun length is ${itemSchema.min}`);
    }

    if (itemSchema.max && body[item].length > itemSchema.max) {
      errors.push(`${item} - maximum is ${itemSchema.max}`);
    }

    const regexItem: any = validationRegex[item];

    if (regexItem && !new RegExp(regexItem.regex).test(body[item])) {
      errors.push(`${item} - incorrect format`);
    }
  });

  if (errors.length > 0) { return errors; }
  return;
}

export { validateUser };
