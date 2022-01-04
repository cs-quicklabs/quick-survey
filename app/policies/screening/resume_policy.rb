class Screening::ResumePolicy < Screening::BaseScreeningPolicy
    def index?
      user.admin? ||  user.resume_screener?
    end
end