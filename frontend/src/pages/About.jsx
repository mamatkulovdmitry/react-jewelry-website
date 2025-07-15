import React, { useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const imageVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "anticipate"
    }
  }
};

const featureCardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: (i) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.5
    }
  })
};

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"О"} text2={"НАС"} />
      </div>
      <motion.div
        className="my-10 flex flex-col md:flex-row gap-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.img
          className="w-full md:max-w-[450px] md:max-h-80 lg:max-h-fit"
          src={assets.about_us}
          alt="About Image"
          variants={imageVariants}
        />
        <motion.div
          className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600"
          variants={containerVariants}
        >
          <motion.p variants={itemVariants}>
            Мы — ювелирный бренд, который вдохновляется традициями и современными тенденциями,
            создавая уникальные украшения для людей, ценящих стиль и качество. Наша цель — предложить
            изделия, которые смогут подчеркнуть индивидуальность каждого клиента и стать неотъемлемой
            частью его образа. В нашем ассортименте вы найдете как классические, так и современные
            ювелирные изделия, идеально подходящие для любых событий и повседневного ношения.
          </motion.p>
          <motion.p variants={itemVariants}>
            Каждое украшение в нашем магазине — это результат тщательной работы наших мастеров,
            которые используют только лучшие материалы. Мы гордимся высоким качеством и вниманием
            к деталям, что позволяет нам создавать не просто аксессуары, а настоящие произведения
            искусства. Мы уверены, что каждый клиент найдет у нас что-то особенное, что станет
            символом его стиля и вкуса.
          </motion.p>
          <motion.b className="text-gray-800" variants={itemVariants}>
            Наша миссия
          </motion.b>
          <motion.p variants={itemVariants}>
            Наша миссия — приносить радость и уверенность нашим клиентам через уникальные
            и долговечные украшения. Мы стремимся создавать изделия, которые сопровождают
            важнейшие моменты жизни, будь то предложение руки и сердца, свадьба или другие
            значимые события. Каждое украшение должно быть наполнено смыслом, который переживет
            время и останется в памяти на долгие годы.
          </motion.p>
        </motion.div>
      </motion.div>
      <div className="text-xl py-4">
        <Title text1={"ПОКУПАЙТЕ"} text2={"У НАС"} />
      </div>
      <motion.div
        className="flex flex-col md:flex-row text-sm mb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Безупречное качество:",
            text: "Мы тщательно отбираем каждое украшение, чтобы оно соответствовало нашим строгим стандартам качества. Все изделия проходят детальную проверку, гарантируя, что каждый клиент получит только лучшее."
          },
          {
            title: "Максимальное удобство:",
            text: "Мы сделали процесс покупок максимально удобным. Наш сайт имеет простой и интуитивно понятный интерфейс, а заказ можно оформить в несколько кликов, не выходя из дома."
          },
          {
            title: "Отличное обслуживание клиентов:",
            text: "Наша команда профессионалов всегда готова помочь вам на каждом этапе покупки. Мы уверены, что удовлетворение потребностей клиента — наш главный приоритет, и всегда стремимся предоставить сервис на высшем уровне."
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5"
            variants={featureCardVariants}
            custom={i}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
          >
            <b>{feature.title}</b>
            <p className="text-gray-600">{feature.text}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <NewsletterBox />
      </motion.div>
    </motion.div>
  )
};

export default About;