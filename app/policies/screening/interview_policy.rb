class Screening::InterviewPolicy < Screening::BaseScreeningPolicy
    def index?
      user.interviewer?
    end
  
  
  end