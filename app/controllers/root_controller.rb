class RootController < ApplicationController
  def index
    path = case current_user.permission
      when "resume_screener"
        resume_path
      when "interview_screener"
        interview_path
      when "telephonic_screener"
        telephonic_path
      when "vendor"
        vendor_path
      when "hr"
        hr_path
      else
        vendor_path
      end

    redirect_to path
  end
end
