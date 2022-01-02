class Screening::TelephonicPolicy < Screening::BaseScreeningPolicy
    def index?
      user.telephonic_screener?
    end
  
  
  end