class Screening::InterviewPolicy < Screening::BaseScreeningPolicy
    def index?
      user.admin? ||  user.interviewer?
    end
  
  
  end