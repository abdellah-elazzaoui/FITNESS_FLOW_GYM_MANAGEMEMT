import React from 'react'
import { FaDumbbell, FaHeartbeat, FaUsers, FaAward, FaCheckCircle } from 'react-icons/fa'
import { GiMuscleUp } from 'react-icons/gi'

const About = () => {
  const features = [
    {
      icon: <FaDumbbell className="text-3xl text-white" />,
      title: "Premium Equipment",
      description: "State-of-the-art Technogym equipment for optimal workouts"
    },
    {
      icon: <FaHeartbeat className="text-3xl text-white" />,
      title: "Personalized Coaching",
      description: "Custom programs tailored to your specific goals"
    },
    {
      icon: <FaUsers className="text-3xl text-white" />,
      title: "Supportive Community",
      description: "Motivating atmosphere and unique team spirit"
    },
    {
      icon: <GiMuscleUp className="text-3xl text-white" />,
      title: "Guaranteed Results",
      description: "Regular follow-up and measurable progress"
    }
  ]

  const stats = [
    { number: "500+", label: "Active Members" },
    { number: "15+", label: "Expert Coaches" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "5", label: "Years of Expertise" }
  ]

  const values = [
    "Excellence in every workout",
    "Constant innovation",
    "Respect for the individual",
    "Passion for sports",
    "Community commitment"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-l from-blue-400 to-blue-700 text-white py-20">
        <div className="absolute inset-0 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            FITNESS <span className="text-blue-700">FLOW</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            More than a gym, a community dedicated to your transformation
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              At <span className="font-semibold text-blue-600">FITNESS FLOW</span>, we believe that every individual has unlimited potential. 
              Our mission is to provide you with the environment, tools, and support needed 
              to unleash your inner strength and transform your life.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-black font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-200 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-blue-600">
              Why Choose Us?
            </h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-blue-700 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Exceptional Facilities
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Our 2000m² center has been designed to optimize your fitness experience. 
                Every space is created with special attention to detail and your comfort.
              </p>
              
              <div className="space-y-4">
                {[
                  "High-tech cardio area (Technogym treadmills, bikes, ellipticals)",
                  "Complete weight training space with Life Fitness equipment",
                  "Group class studio (yoga, Pilates, HIIT, spinning)",
                  "Functional training and cross-training area",
                  "Premium locker rooms with secure lockers",
                  "Relaxation area and nutrition bar"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Our Values
              </h3>
              <div className="space-y-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-800 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Team of Experts
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Our <span className="font-semibold text-blue-600">15 certified coaches</span> share 
              a common passion: seeing you succeed. Their expertise covers all areas of fitness, 
              from weight training to sports rehabilitation.
            </p>
            <div className="bg-blue-600 text-white rounded-lg p-6 inline-block">
              <FaAward className="text-4xl mx-auto mb-4" />
              <p className="text-lg font-semibold">
                Internationally recognized certifications
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the FORCE MAX family and discover the best version of yourself
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
              Free Trial
            </button>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors border border-white">
              Guided Tour
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About