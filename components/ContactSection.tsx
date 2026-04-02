"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useActionState } from "react";
import { createContact } from "@/app/actions/contactActions";

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const sectionRef = useRef(null);
  const formRef = useRef<HTMLFormElement>(null); // Add form ref

  const initialState = {
    success: false,
    message: "",
    errors: {
      name: undefined,
      email: undefined,
      phone: undefined,
      message: undefined,
      status: undefined,
    },
  };
  const [state, formAction, isPending] = useActionState(
    createContact,
    initialState
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setAnimationKey((prev) => prev + 1);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "-50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Reset form fields on successful submission
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <section
      ref={sectionRef}
      id="contact-form"
      className="py-5 px-[3rem] sm:px-[3rem] md:px-[3rem] lg:px-[4rem] bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div
          key={`header-${animationKey}`}
          className={`mb-12 transition-all duration-100 ${
            isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-[30px]"
          }`}
        >
          <h2
            key={`title-${animationKey}`}
            className={`text-[14px] lg:text-[16px] font-bold text-gray-800 mb-4 transition-all duration-100 ${
              isVisible
                ? "animate-fadeInUp animation-delay-200"
                : "opacity-0 translate-y-[30px]"
            }`}
          >
            Send Your Message
          </h2>
          <p
            key={`description-${animationKey}`}
            className={`text-gray-600 text-[14px] max-w-3xl transition-all duration-100 ${
              isVisible
                ? "animate-fadeInUp animation-delay-400"
                : "opacity-0 translate-y-[30px]"
            }`}
          >
            Whether you need business services, beauty care, 
            delivery solutions, or have questions about our charitable activities, this is the place to
            reach us. Please fill out the form below with your details and
            message, and we'll get back to you as soon as possible.
          </p>
        </div>
        <div className="flex items-center justify-between gap-10 md:flex-row flex-col">
          {/* Left */}
          <div
            key={`left-panel-${animationKey}`}
            className={`flex w-full bg-gradient-to-br from-blue-50 to-indigo-50 lg:w-1/2 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-100 ${
              isVisible
                ? "animate-fadeInLeft animation-delay-600"
                : "opacity-0 translate-x-[-50px]"
            }`}
          >
            <div className="relative h-[350px] w-1/2 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-100 z-10"></div>
              <img
                src="/images/contact-phone.jpg"
                alt="Contact MY EDUQUALITY PARTNER LTD"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-100"
              />
            </div>
            <div className="lg:col-span-3 p-4 space-y-10">
              {[
                { icon: Clock, title: "We're Open", info: "24/7", delay: 800 },
                {
                  icon: MapPin,
                  title: "Office Location",
                  info: "Nyarugenge, Kigali, Rwanda",
                  delay: 1000,
                },
                {
                  icon: Phone,
                  title: "Call Us Directly",
                  info: "+250 788 676 421",
                  delay: 1200,
                },
                {
                  icon: Mail,
                  title: "Send a Message",
                  info: "myeduqualitypartner@gmail.com",
                  delay: 1400,
                },
              ].map((item, index) => (
                <div
                  key={`contact-item-${index}-${animationKey}`}
                  className={`transition-all duration-100 hover:transform hover:scale-105 ${
                    isVisible
                      ? "animate-fadeInUp"
                      : "opacity-0 translate-y-[30px]"
                  }`}
                  style={{
                    animationDelay: `${item.delay}ms`,
                    transitionDelay: isVisible ? `${item.delay}ms` : "0ms",
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600/20 p-2 rounded-full hover:bg-blue-600/30 transition-colors duration-100 hover:scale-110 transform">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-[14px] hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-[12px] hover:text-blue-600 transition-colors cursor-pointer">
                        {item.info}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right Contact Form */}
          <div
            key={`form-panel-${animationKey}`}
            className={`w-full lg:w-1/2 transition-all duration-100 ${
              isVisible
                ? "animate-fadeInRight animation-delay-800"
                : "opacity-0 translate-x-[50px]"
            }`}
          >
            <div className="h-[350px] bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-100">
              <form ref={formRef} action={formAction} className="space-y-4">
                {[
                  {
                    name: "name",
                    type: "text",
                    placeholder: "Your Name *",
                    required: true,
                    delay: 1000,
                  },
                  {
                    name: "email",
                    type: "email",
                    placeholder: "Your Email *",
                    required: true,
                    delay: 1100,
                  },
                  {
                    name: "phone",
                    type: "tel",
                    placeholder: "Your Phone (Optional)",
                    required: false,
                    delay: 1200,
                  },
                ].map((field) => (
                  <div
                    key={`field-${field.name}-${animationKey}`}
                    className={`transition-all duration-100 ${
                      isVisible
                        ? "animate-fadeInUp"
                        : "opacity-0 translate-y-[30px]"
                    }`}
                    style={{
                      animationDelay: `${field.delay}ms`,
                      transitionDelay: isVisible ? `${field.delay}ms` : "0ms",
                    }}
                  >
                    <Input
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      disabled={isPending}
                      className="w-full h-10 px-4 border text-[12px] placeholder:text-[12px] border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-blue-600/50 transition-all duration-100 disabled:opacity-50"
                    />
                    {state.errors?.[
                      field.name as keyof typeof state.errors
                    ] && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          state.errors[
                            field.name as keyof typeof state.errors
                          ]?.[0]
                        }
                      </p>
                    )}
                  </div>
                ))}
                <div
                  key={`textarea-${animationKey}`}
                  className={`transition-all duration-100 ${
                    isVisible
                      ? "animate-fadeInUp animation-delay-1300"
                      : "opacity-0 translate-y-[30px]"
                  }`}
                >
                  <Textarea
                    name="message"
                    placeholder="Your Message *"
                    required
                    rows={3}
                    disabled={isPending}
                    className="w-full px-4 py-2 text-[12px] placeholder:text-[12px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none hover:border-blue-600/50 transition-all duration-100 disabled:opacity-50"
                  />
                  {state.errors?.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.message[0]}
                    </p>
                  )}
                </div>
                {/* Status Message */}
                {state.message && (
                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg text-sm ${
                      state.success
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {state.success ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>{state.message}</span>
                  </div>
                )}
                <div
                  key={`button-${animationKey}`}
                  className={`transition-all duration-100 ${
                    isVisible
                      ? "animate-fadeInUp animation-delay-1400"
                      : "opacity-0 translate-y-[30px]"
                  }`}
                >
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-[6rem] bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-semibold rounded-[5px] hover:scale-105 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isPending ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
