import { Plot, Service } from './types';

export const PLOTS: Plot[] = [
  {
    id: '1',
    title: 'The Secret Garden',
    price: 45,
    size: '25m²',
    distance: '1.2 miles away',
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALUIbavtNW89YyATZ6hOdtSytoTryIITS_2uyab9aXoXoEZUigaUW9_tA8R9niqu-ZGVSIlLPU0R9LJASWbmOP7JJYroksuKnnbmrnCTLSZ2nes_kZrc1grubnRFF7Eq-CymckKZFhV23MqF7r_FmSr6JkTgY_K7zH4xPFTXTbADwB2FXlqmXNaHuYzczdrIY_7vHpYipT4JyfKhh56zKuSFV2y395o_yRMrAPfW4sLlq22t4vU8TmK7uXSaWjMyJm892DVVN_Ye_q',
    tags: ['LOAMY SOIL', 'WATER INCLUDED'],
    host: 'Sarah Jenkins',
    location: 'North Quarter District',
    soilType: 'Loamy Soil',
    exposure: 'Full Sun',
    utilities: ['Water Access', 'Toolshed']
  },
  {
    id: '2',
    title: 'Urban Oasis',
    price: 62,
    size: '18m²',
    distance: '0.8 miles away',
    rating: 4.7,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAemVVAq5xe-FLV8fPxLddqeFxBEnZFeQq5nS6sFFn3BEx9yFsPq9B9sVOADJvBYpnkucp-GqIeNYpELeDPAQ1_GN3ypECYhAvcRXdOEn2R0zHVMl__3Ji8HAnTxySHYqCpb6aNdY1YMx_Qxxv1O91lOHqB3rLhTIjiH3AvZp4KQGBvN6Ds0N5NvUrF4WI11voNJqC-AdQZ91ksys66cj-TgNNRvbdnJOiMqaugRk1FFoupeLsVf0gUg8gPBWmOzscGYgB30Wqr6lA',
    tags: ['COMPOST RICH', 'TOOLSHED'],
    host: 'Arthur P. Wickens',
    location: 'Hampstead Heath, London',
    soilType: 'Clay Loam',
    exposure: 'Full Sun',
    utilities: ['Water Access']
  }
];

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Starter Tool Kit',
    price: 25,
    description: 'Everything you need to begin your journey: trowel, transplanter, and hand rake.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSfUKyinpec3ogNCj02jfiIjX1GNnAaL1w448bHGYKaohyd2LHqhTwc6C0h_SZ5J2w31Ta6OkT2pY6MZFpRQTgC3diiumC_O2Damc0oT-7C-dyilHQDcJ31-aJlc3L9XiA3UV9UUKzusk8gdLtk7KuXcK9eaG-VY5gFXlNVw7lLHw6iS3eWLidCScUCUBstlXVN1k8ukMIjBWh8fAPIgBzQo5cTU5yC7c2sp84klkdYXuYNKbYoecXh7zo99dPao6-PFUSBV2YSaw2',
    tag: 'Essential'
  },
  {
    id: '2',
    title: 'Seasonal Seed Box',
    price: 15,
    description: 'A curated collection of heirloom seeds specifically chosen for current climate conditions.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ifRYzPRh0qdvTdq6i8TfmCiclthcLnJIIQr7E7bEPi_xF32tNQPTqIE0W4BxPCFfQ_kbR83IKIIkhBdcl7wO_Wkhbl6ut92f1Y_7ZFFMNVzNl8_zJ4qMDYTwPYS9A1NP7_9Rh4Fe7MDsw3sv-M0QRttA9M1LS6pFCraxWfMrm9JDRX303BPMjRynh_1QR3T3VHDLOBw9qxSQ_a3CafuId9vMpOjbESsoUnUq0UhDC_WI2n4qv_MHSV-qU2eHxeBMlgXB5z_0WUOG',
    tag: 'Seasonal'
  },
  {
    id: '3',
    title: 'Video Coaching Session',
    price: 30,
    description: 'One-on-one session with a master gardener to solve your specific plot challenges.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAQ3Kn5WqEoWAJJ_xxxdid-9QNI_qEmU_c1dWrqkST2P1qyB42lqPTV-23zsQa_KT1L5LjnVOsvLzA2rZizq5Rgxmc7FvVbGYEptd6TblmHSIOxJE1ceoCen4go8OGZFvcwJ7kEpQupH3NrhAKponMGhFG_AR_yRh3g0O0znrq5hwsXqynSdrMXC8i320TNsCyaYVyL5YTdJ3Qh7-TKb9f7RcORV4nfwB3DayagJ2Yk8lUIyM38JMKSPh4O_GUbf6dAl6VkLJj8Ifj',
    tag: 'Expert Help',
    unit: '/hr'
  }
];
