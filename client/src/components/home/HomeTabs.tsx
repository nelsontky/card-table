import React from "react";
import { Tabs, Tab, TabsProps } from "@material-ui/core";

export interface IHomeTabs {
  value: number;
  setValue: (number: number) => void;
  TabsProps?: TabsProps;
  [x: string]: any;
}

export default function HomeTabs({
  value,
  setValue,
  TabsProps,
  ...rest
}: IHomeTabs) {
  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} {...rest} {...TabsProps} onChange={handleChange}>
      <Tab label="Decks" />
      <Tab label="Start Game" />
    </Tabs>
  );
}
