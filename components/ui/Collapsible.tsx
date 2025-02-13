"use client";

import { type PropsWithChildren } from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

import "./Collapsible.css";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = (
  props: PropsWithChildren<{ className: string }>
) => (
  <CollapsiblePrimitive.CollapsibleContent
    {...props}
    className={`collapsible-content ${props.className}`}
  />
);

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
