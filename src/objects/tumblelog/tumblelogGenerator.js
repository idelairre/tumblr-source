import Faker from 'faker';
import generateName from '../name/nameGenerator';
import { generateTitleByTemplate, generateTitleByMarkovChain } from '../title/titleGenerator';
import { generateDescriptionByTemplate, generateDescriptionByMarkovChain } from '../description/descriptionGenerator';

export const generateTumblelog = (name = generateName()) => {
  const tumblelogDescription = generateDescriptionByMarkovChain();
  return {
    anonymous_asks: Faker.random.number({ min: 0, max: 1 }),
    asks: Faker.random.boolean(),
    avatar_url: `https://66.media.tumblr.com/avatar_${Faker.random.uuid().slice(0, 12).replace(/-/g, '')}_128.png`,
    can_recieve_message: Faker.random.boolean(),
    can_send_messages: Faker.random.boolean(),
    can_subscribe: Faker.random.boolean(),
    cname: '',
    customizable: Faker.random.boolean(),
    dashboard_url: `/blog/${name}`,
    description: tumblelogDescription,
    description_sanitized: tumblelogDescription,
    following: Faker.random.boolean(),
    is_group: Faker.random.boolean(),
    is_private: Faker.random.boolean(),
    is_subscribed: Faker.random.boolean(),
    likes: Faker.random.number(),
    name: name,
    premium_partner: false,
    share_following: Faker.random.boolean(),
    title: generateTitleByTemplate(),
    url: `http://${name}.tumblr.com`,
    uuid: `${name}.tumblr.com`
  };
}

export const generateTumblelogs = num => {
  const tumblelogs = [];
  for (let i = 0; i < num; i += 1) {
    tumblelogs.push(generateTumblelog());
  }
  return tumblelogs;
}
