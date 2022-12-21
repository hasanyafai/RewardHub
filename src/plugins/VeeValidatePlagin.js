import { Form, Field, ErrorMessage, defineRule } from 'vee-validate'
import { required, email, numeric, image, regex } from '@vee-validate/rules'

export default (app) => {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('phoneNumber', numeric)
  defineRule('image', image)
  defineRule('regex', regex)
  defineRule('confirmed', (value, [target], ctx) => {
    if (value === ctx.form[target]) {
      return true;
    }
    return 'Passwords must match';
  });

  defineRule('businessName', (value) => {
    const nameLength = String(value).replace(/\s/g, "").length
    if (nameLength <= 20) {
      return true;
    }
    return 'Business name should not exceed 20 letters';
  });

  defineRule('rewardAddress', (value) => {
    if (value.match(/\s/)) {
      return 'incorrect reward address';
    }
    return true;
  });

  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
  //app.component('ValidationProvider', ValidationProvider)
}
