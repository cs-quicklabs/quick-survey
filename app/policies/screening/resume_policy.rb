class Screening::ResumePolicy < Screening::BaseScreeningPolicy
    def index?
      user.resume_screener?
    end
end