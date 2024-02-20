import LogsComponent from "../components/logs";
export default {
  title: "Components/Logs",
  component: LogsComponent,
};

const Template = args => <LogsComponent {...args} />

export const Red = Template.bind({})
Red.args = {
    selectedTime: '5'
}
