import { Polybase } from "@polybase/client";

const db = new Polybase({
    defaultNamespace: "pk/0x1a57dc69d2e8e6938a05bdefbebd62622ddbb64038f7347bd4fe8beb37b9bf40d5e8b62eaf9de36cbff52904b7f81bff22b29716021aaa8c11ee552112143259/Guardian",
  });

export const dbUser = db.collection("User")