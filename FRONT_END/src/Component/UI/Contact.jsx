import React from 'react'
import { useForm } from 'react-hook-form'
import { FaPaperPlane, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import { toast } from 'react-toastify'

const Contact = () => {
    const { register, handleSubmit, formState, reset } = useForm()
    const { errors, isSubmitting } = formState
    
    async function onSubmit(data) {
        try {
            // Simulation of sending
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log('Data submitted:', data)
            toast.success('Message sent successfully!')
            reset()
        } catch (error) {
            toast.error('Error sending message')
        }
    }

    const contactInfo = [
        {
            icon: <FaPhone className="text-xl text-blue-600" />,
            title: "Phone",
            content: "+212 54332178",
            subtitle: "Mon-Fri: 8am-8pm"
        },
        {
            icon: <FaEnvelope className="text-xl text-blue-600" />,
            title: "Email",
            content: "forcemax@gmail.com",
            subtitle: "Response within 24h"
        },
        {
            icon: <FaMapMarkerAlt className="text-xl text-blue-600" />,
            title: "Address",
            content: "Hay Salam, Agadir, Morocco",
            subtitle: "Visit us!"
        },
        {
            icon: <FaClock className="text-xl text-blue-600" />,
            title: "Opening Hours",
            content: "6:00 - 23:00",
            subtitle: "7 days a week"
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Contact <span className="text-blue-600">Us</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Have a question? A problem? Our team is here to help you quickly.
                    </p>
                    <div className="w-20 h-1 bg-blue-600 mx-auto mt-6"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Contact Details</h3>
                            
                            <div className="space-y-6">
                                {contactInfo.map((item, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                            <p className="text-gray-700 text-lg">{item.content}</p>
                                            <p className="text-gray-500 text-sm">{item.subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Virtual Card */}
                            <div className="mt-8 p-4 bg-blue-700 rounded-xl text-white">
                                <h4 className="font-semibold mb-2">Guaranteed Response</h4>
                                <p className="text-sm text-gray-300">
                                    We commit to responding to all your requests as soon as possible.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h3>
                            <p className="text-gray-600 mb-8">
                                Fill out the form below and we'll get back to you quickly.
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                                errors.firstName 
                                                    ? 'border-red-500 focus:ring-red-200' 
                                                    : 'border-blue-600 focus:border-blue-600 focus:ring-blue-600'
                                            }`}
                                            placeholder="Your first name"
                                            {...register("firstName", { 
                                                required: "First name is required",
                                                minLength: {
                                                    value: 2,
                                                    message: "First name must be at least 2 characters"
                                                }
                                            })}
                                        />
                                        {errors?.firstName && (
                                            <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                                errors.lastName 
                                                    ? 'border-red-500 focus:ring-red-200' 
                                                    : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
                                            }`}
                                            placeholder="Your last name"
                                            {...register("lastName", { 
                                                required: "Last name is required",
                                                minLength: {
                                                    value: 2,
                                                    message: "Last name must be at least 2 characters"
                                                }
                                            })}
                                        />
                                        {errors?.lastName && (
                                            <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                            errors.email 
                                                ? 'border-red-500 focus:ring-red-200' 
                                                : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
                                        }`}
                                        placeholder="example@gmail.com"
                                        {...register("email", { 
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                    />
                                    {errors?.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                            errors.subject 
                                                ? 'border-red-500 focus:ring-red-200' 
                                                : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
                                        }`}
                                        {...register("subject", { 
                                            required: "Please select a subject"
                                        })}
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="membership">Membership and pricing</option>
                                        <option value="training">Training programs</option>
                                        <option value="technical">Technical problem</option>
                                        <option value="complaint">Complaint</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors?.subject && (
                                        <p className="mt-2 text-sm text-red-600">{errors.subject.message}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                                            errors.message 
                                                ? 'border-red-500 focus:ring-red-200' 
                                                : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
                                        }`}
                                        placeholder="Describe your request in detail..."
                                        {...register("message", { 
                                            required: "Message is required",
                                            minLength: {
                                                value: 10,
                                                message: "Message must be at least 10 characters"
                                            },
                                            maxLength: {
                                                value: 1000,
                                                message: "Message cannot exceed 1000 characters"
                                            }
                                        })}
                                    />
                                    {errors?.message && (
                                        <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 ${
                                        isSubmitting 
                                            ? 'opacity-50 cursor-not-allowed' 
                                            : 'hover:bg-blue-700 transform hover:-translate-y-0.5'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="text-lg" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Quick FAQ */}
                <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                question: "What are the opening hours?",
                                answer: "We are open from 6:00 to 23:00, 7 days a week."
                            },
                            {
                                question: "Do you offer a free trial?",
                                answer: "Yes, we offer a free trial session with a coach."
                            },
                            {
                                question: "What payment methods do you accept?",
                                answer: "Cash, credit cards, bank transfers, and checks."
                            },
                            {
                                question: "Is there parking available?",
                                answer: "Yes, free and secure parking is available for you."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact