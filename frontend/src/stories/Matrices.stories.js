import MetricsComponent from "../components/matrics";
export default {
  title: "Components/Metrices",
  component: MetricsComponent,
};

const Template = args => <MetricsComponent {...args} />

export const Blue = Template.bind({})
Blue.args = {
  selectedTime: '5'
}
