import Faker from 'faker';
import { first, sample } from 'lodash';
import { generateTumblelogName } from './index';

const contentRating = () => {
  return sample(['adult', 'nsfw']);
}

const type = () => {
  return sample(['photo', 'photoset', 'quote', 'note', 'video', 'answer', 'link', 'chat'])
}

const state = () => {
  return sample(['published', 'queued', 'draft', 'private']);
}

const flavor = tumblelog => {
  let modifier = sample(['anarchy', 'slut', 'blood', 'communist', 'mermaid', 'fox', 'scorpio', 'queer', 'antifa', '69', 'trans', 'supa', 'slayin', 'words', 'poly']);
  if (Faker.random.boolean()) {
    return tumblelog + `${sample('-', '_', '', '-and-') + modifier}`;
  } else {
    return modifier + tumblelog;
  }
}

export const generateClientPost = () => {
  const tumblelog = generateTumblelogName();
  const id = Faker.random.number();
  const timestamp = Faker.date.past();

  const post = {
    'accepts-answers': Faker.random.boolean(),
    'blog_name': tumblelog,
    'direct-video': '',
    'id': id,
    'is-animated': Faker.random.boolean(),
    'is-pinned': false,
    'is_mine': false,
    'is_reblog': Faker.random.boolean(),
    'is_recommended': false,
    'liked': Faker.random.boolean(),
    'log-index': Faker.random.number({ min: 0: max: 2 }),
    'note_count': Faker.random.number(),
    'placement_id': null,
    'post-id': id.toString(),
    'premium-tracked': null,
    'pt': Faker.random.alphaNumeric(),
    'recommendation-reason': null,
    'root_id': id,
    'serve-id': Faker.random.alphaNumeric(),
    'share_popover_data': {},
    'sponsered': '',
    'tags': Faker.random.words(),
    'tumblelog': tumblelog,
    'tumblelog-content-rating': contentRating(),
    'tumblelog-key': Faker.random.alphaNumeric(),
    'tumblelog-name': tumblelog,
    'tumblelog-parent-data': {},
    'tumblelog-root-data': {},
    'type': type()
  };

  if (Faker.random.boolean()) {
    delete post['tumblelog-content-rating'];
  }

  return post;
}

export const generatePosts = num => {
  const posts = [];
  for (let i = 0; i < num; i += 1) {
    posts.push(generatePost());
  }
  return posts;
}
