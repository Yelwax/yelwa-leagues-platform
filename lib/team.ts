// Add a new person by adding another entry. Cards alternate sides automatically.
export type Member = { name: string; role: string; photo?: string; bio: string[] }

export const team: Member[] = [
  {
    name: 'Muhammad Inuwa Abubakar',
    role: 'Founder, Yelwax Solutions | Lead Speaker, Yelwa Leagues',
    photo: '', // e.g. '/founder.jpg' (put the photo file in the public folder)
    bio: [
      'Muhammad started Yelwax in 2022 and has grown it from an everyday utility service into a company with a bigger goal: an ecosystem of sustainable Nigerian businesses. He runs Yelwax VTU Services, which makes data, airtime and bill payments affordable for everyday Nigerians. He is building Vendoer, a hyper-local commerce platform for students and university communities, and is a co-founder of Navora Collective, a digital architecture and design collective. He is also completing a degree in Building at Ahmadu Bello University, Zaria.',
      'At Yelwa Leagues he leads the live sessions and built the curriculum around real businesses, real customers and real challenges. He teaches the bottleneck because he has lived it.',
    ],
  },
]
