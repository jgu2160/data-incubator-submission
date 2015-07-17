
require 'sinatra'

class GraphApp < Sinatra::Base
  get '/bar' do
    send_file 'graph1.html'
  end

  get '/scatter' do
    send_file 'graph2.html'
  end
end
