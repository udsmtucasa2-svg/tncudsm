// ABOUT PAGE CONTENT - edit here, the page updates itself.
// The 28 Fundamental Beliefs of the Seventh-day Adventist Church, grouped like the official church website.
// Short summaries are written in plain words for students; the full statements are at adventist.org/beliefs.
export const beliefGroups = [
  {
    key: 'god', title: 'God and the Bible', icon: 'faith',
    items: [
      ['Holy Scriptures', 'The Bible is God\'s inspired Word and our final guide for faith and life.'],
      ['Trinity', 'There is one God in three persons: Father, Son and Holy Spirit.'],
      ['God the Father', 'The loving Creator and Sustainer of everything, just and merciful.'],
      ['God the Son', 'Jesus Christ is fully God and fully human, our Saviour and Lord.'],
      ['God the Holy Spirit', 'The Spirit draws us to Christ, changes our lives and empowers us to serve.'],
    ],
  },
  {
    key: 'humanity', title: 'Humanity', icon: 'users',
    items: [
      ['Creation', 'God made the world and everyone in it, and He rested on the seventh day.'],
      ['The Nature of Humanity', 'We are made in God\'s image as whole persons: body, mind and spirit.'],
      ['The Great Controversy', 'Life is shaped by a conflict between Christ and Satan. At the cross Christ won the victory.'],
    ],
  },
  {
    key: 'salvation', title: 'Salvation', icon: 'evangelism',
    items: [
      ['Life, Death and Resurrection of Christ', 'Jesus lived without sin, died for our sins and rose again so that we can be forgiven.'],
      ['The Experience of Salvation', 'We are saved by grace, through faith in Jesus, not by our own effort.'],
      ['Growing in Christ', 'Daily prayer, Bible study and the Spirit help us grow and overcome.'],
    ],
  },
  {
    key: 'church', title: 'The Church', icon: 'church',
    items: [
      ['The Church', 'God\'s family of believers who worship, learn and serve together.'],
      ['The Remnant and Its Mission', 'We are called to share the everlasting gospel and the message of Christ\'s return.'],
      ['Unity in the Body of Christ', 'Every nation, culture and background is one in Christ.'],
      ['Baptism', 'A public choice to follow Jesus, by immersion in water.'],
      ['The Lord\'s Supper', 'Communion with foot washing, remembering Christ\'s sacrifice and renewing our commitment.'],
      ['Spiritual Gifts and Ministries', 'God gives every member gifts to build up the church and serve others.'],
      ['The Gift of Prophecy', 'Adventists see this gift in the ministry of Ellen G. White, always tested by the Bible.'],
    ],
  },
  {
    key: 'life', title: 'Christian Life', icon: 'possibility',
    items: [
      ['The Law of God', 'The Ten Commandments show God\'s love and guide how we live.'],
      ['The Sabbath', 'We rest and worship on the seventh day, a gift from our Creator.'],
      ['Stewardship', 'Our time, talents, body and resources belong to God, and we manage them faithfully.'],
      ['Christian Behaviour', 'We choose what is pure, healthy and good for body, mind and spirit.'],
      ['Marriage and the Family', 'Marriage and family are God\'s gift, built on love, respect and faithfulness.'],
    ],
  },
  {
    key: 'last', title: 'Last Things', icon: 'vision',
    items: [
      ['Christ\'s Ministry in the Heavenly Sanctuary', 'Jesus serves as our High Priest in heaven on our behalf.'],
      ['The Second Coming of Christ', 'Jesus will return in person and the whole world will see Him. This is our blessed hope.'],
      ['Death and Resurrection', 'Death is a rest until the resurrection, when Christ gives life to His people.'],
      ['The Millennium and the End of Sin', 'After Christ returns, sin and its effects will be ended for ever.'],
      ['The New Earth', 'God will make all things new, and His people will live with Him in peace.'],
    ],
  },
];

// OUR STORY: the Adventist movement and where TNC fits in. Keep each line short.
export const story = [
  { year: '1840s', title: 'A movement of Bible students', text: 'Christians across several churches studied the prophecies about Christ\'s return. After the disappointment of 1844, some kept studying the Bible together.' },
  { year: '1860', title: 'A name is chosen', text: 'The group took the name Seventh-day Adventist: the seventh-day Sabbath, and hope in the Advent (return) of Jesus.' },
  { year: '1863', title: 'The General Conference', text: 'The church was formally organised in Battle Creek, Michigan, and began sending missionaries around the world.' },
  { year: 'Today', title: 'A worldwide family', text: 'Adventists live in more than 200 countries and run schools, hospitals and relief work, including ADRA.' },
  { year: 'On campus', title: 'TNC UDSM', text: 'Public Campus Ministries serves students at public universities. TNC is the Adventist student family at TUCASA Nyerere Campus, University of Dar es Salaam.' },
];

// HOW THE CHURCH IS ORGANISED (from the local church up).
export const structure = [
  ['Local church', 'Members and ministries, like TNC on campus'],
  ['Conference or Mission', 'Several churches in one area'],
  ['Union', 'Several conferences together'],
  ['Division', 'A world region'],
  ['General Conference', 'The worldwide church'],
];